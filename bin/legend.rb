class Legend
  attr_accessor :legend
                # :set_a, :set_b, :set_a_uniq, :set_b_uniq, :sets_a_b,
                # :sets_a_uniq_b_uniq, :set_uniq, :modifiers
  
  def initialize(set_a, set_b)
    @legend = (set_a + set_b).uniq!
=begin
    # @set_a = set_a
    # @set_b = set_b
    # @set_a_uniq = @set_a.uniq
    # @set_b_uniq = @set_b.uniq
    # @sets_a_b = @set_a + @set_b
    # @sets_a_uniq_b_uniq = @set_a_uniq + @set_b_uniq
    # @set_uniq = @sets_a_uniq_b_uniq.uniq
    # @modifiers = ["a","b","c","d","fr"]
=end
    normalize_labels
    sort_labels
  end

=begin
  def discover_modifiers
    @modifiers = []
    @set_uniq.each do |r|
      if match = r.match(/(\D+)/i)
        @modifiers.push(match.captures[0])
      end
    end
    @modifiers.uniq!
  end
=end

  def normalize_labels
    @legend.map! { |r|
      r.sub!(/^0+/,"")

      if match = r.match(/(\d+)(\D+)/i)
        digit, nondigit = match.captures
      else
        digit = r
        nondigit = ""
      end

      case digit.length
      when 1
        "000" + digit + nondigit
      when 2
        "00" + digit + nondigit
      when 3
        "0" + digit + nondigit
      when 4
        digit + nondigit
      end
    }
  end

  def sort_labels
    @legend.sort!
  end

end
